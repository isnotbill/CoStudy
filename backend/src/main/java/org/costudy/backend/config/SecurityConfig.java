package org.costudy.backend.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.costudy.backend.model.User;
import org.costudy.backend.repo.UserRepo;
import org.costudy.backend.service.CustomOAuth2UserService;
import org.costudy.backend.service.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtFilter jwtFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final UserRepo userRepo;
    private final JwtService jwtService;

    public SecurityConfig(UserDetailsService userDetailsService,
                          JwtFilter jwtFilter,
                          CustomOAuth2UserService oAuth2UserService,
                          UserRepo userRepo,
                          JwtService jwtService
    ) {

        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
        this.customOAuth2UserService = oAuth2UserService;
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationProvider authProvider(PasswordEncoder passwordEncoder){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
//        provider.setPasswordEncoder(NoOpPasswordEncoder.getInstance());
         provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, HttpServletResponse httpServletResponse) throws Exception {
        http.cors(withDefaults -> {});
        http.csrf(customizer -> customizer.disable());

        http.authorizeHttpRequests(request -> request
                .requestMatchers("/register","/login", "/refresh-token", "/avatars/**","/logout", "/ws/**", "/oauth2/**", "/login/oauth2/**")
                .permitAll()
                .anyRequest().authenticated())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .deleteCookies("access_token", "refresh_token")
                        .logoutSuccessHandler((req,res,auth) -> res.setStatus(HttpServletResponse.SC_OK))
                        .permitAll())
                .oauth2Login(oauth ->
                        oauth.userInfoEndpoint(userInfo ->
                                            userInfo.userService(customOAuth2UserService)
                                        )
                                .successHandler(((request, response, authentication) -> {
                                    OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
                                    String email = oauthUser.getAttribute("email");

                                    User user = userRepo.findByEmail(email).orElseGet(() -> {
                                        System.out.println("Creating user..." + oauthUser.toString());
                                        User newUser = new User();
                                        newUser.setEmail(email);
                                        newUser.setProvider("GOOGLE");

                                        return userRepo.save(newUser);
                                    });

                                    String accessToken = jwtService.generateAccessToken(user.getUsername());
                                    String refreshToken = jwtService.generateRefreshToken(user.getUsername());

                                    ResponseCookie accessTokenCookie = ResponseCookie.from("access_token", accessToken)
                                            .httpOnly(true)
                                            .secure(false) // set true in production!
                                            .path("/")
                                            .maxAge(24 * 60 * 60)
                                            .sameSite("Lax")
                                            .build();

                                    ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refreshToken)
                                            .httpOnly(true)
                                            .secure(false)
                                            .path("/")
                                            .maxAge(24 * 60 * 60)
                                            .sameSite("Lax")
                                            .build();

                                    response.setStatus(HttpServletResponse.SC_OK);
                                    response.setContentType("application/json");

                                    response.setHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
                                    response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
                                })))
                .addFilterBefore(jwtFilter, OAuth2LoginAuthenticationFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}



