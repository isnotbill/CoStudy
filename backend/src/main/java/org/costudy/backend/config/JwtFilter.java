package org.costudy.backend.config;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.costudy.backend.service.JwtService;
import org.costudy.backend.service.CustomUserDetailsService;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ApplicationContext context;

    public JwtFilter(ApplicationContext context, JwtService jwtService) {
        this.jwtService = jwtService;
        this.context = context;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();

        if (path.equals("/login")
                || path.equals("/register")
                || path.equals("/refresh-token")
                || path.startsWith("/oauth2/")
                || path.startsWith("/login/oauth2")){
            filterChain.doFilter(request, response);
            return;
        }


        String authHeader = request.getHeader("Authorization");
        String token = null;
        String userName = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);

        } else {
            Cookie[] cookies = request.getCookies();
            if (cookies != null){
                for (Cookie cookie : cookies){
                    if ("access_token".equals(cookie.getName())){
                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }
        try {
            if (token != null) {
                userName = jwtService.extractUserName(token);
            }
            if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = context.getBean(CustomUserDetailsService.class).loadUserByUsername(userName);
                if (jwtService.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException ex) {
//            ResponseCookie expired = ResponseCookie.from("token", "")
//                    .path("/")
//                    .maxAge(0)
//                    .build();
//            response.setHeader(HttpHeaders.SET_COOKIE, expired.toString());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token expired\"");
            response.getWriter().flush();
            return;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid Token\"}");
            response.getWriter().flush();
            return;
        }
        filterChain.doFilter(request, response);
    }
}
