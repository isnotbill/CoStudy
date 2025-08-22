package org.costudy.backend.config;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.costudy.backend.service.RateLimitService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private final RateLimitService rateLimitService;
    private final RateLimitConfig rateLimitConfig;

    public RateLimitFilter(RateLimitService rateLimitService, RateLimitConfig rateLimitConfig) {
        this.rateLimitService = rateLimitService;
        this.rateLimitConfig = rateLimitConfig;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
        throws ServletException, IOException {

        String routeKey = mapRouteToKey(req);
        int limit = rateLimitConfig.getLimitFor(routeKey);

        String subject = currentUsername().orElse(rateLimitService.getClientIp(req));
        String subjectKey = subject + ":" + routeKey;

        Bucket bucket = rateLimitService.resolveBucket(subjectKey, limit);

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        res.setHeader("X-RateLimit-Limit", String.valueOf(limit));
        res.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, probe.getRemainingTokens())));

        if (probe.isConsumed()){
            chain.doFilter(req, res);
        } else {
            long waitSeconds = (long) Math.ceil(probe.getNanosToWaitForRefill() / 1_000_000_000.0);
            res.setStatus(429);
            res.setHeader("Retry-After", String.valueOf(waitSeconds));
            res.setContentType("text/plain");
            res.getWriter().write("Too Many Requests");
        }


    }

    private Optional<String> currentUsername() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return Optional.empty();
        return Optional.ofNullable(auth.getName());
    }

    private String mapRouteToKey(HttpServletRequest req) {
        String uri = req.getRequestURI();
        if (uri.startsWith("/login"))  return "login";
        if (uri.startsWith("/register")) return "signup";
        return "default";
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        // Exempt health checks, static if desired
        return "/actuator/health".equals(uri);
    }
}
