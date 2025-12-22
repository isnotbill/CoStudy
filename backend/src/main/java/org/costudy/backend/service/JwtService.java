package org.costudy.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.costudy.backend.config.JwtProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties props;

//    @Value("${jwt.secret}")
//    private String secretKey;
//
//    @Value("${jwt.expiration}")
//    private long expiration;
//
//    @Value("${jwt.refreshExpiration}")
//    private long refreshExpiration;

    private Key getKey(){
        byte[] keyBytes = Decoders.BASE64.decode(props.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String generateToken(
            String username,
            Map<String, Object> claims,
            long expiration
    ) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey(), SignatureAlgorithm.HS256).compact();
    }

    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return generateToken(username, claims, props.getRefreshExpiration());
    }

    public String generateAccessToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return generateToken(username, claims, props.getExpiration());
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public ResponseCookie accessTokenCookie(String token) {
        return buildCookie("access_token", token, props.getExpiration());
    }

    public ResponseCookie refreshTokenCookie(String token) {
        return buildCookie("refresh_token", token, props.getRefreshExpiration());
    }

    private ResponseCookie buildCookie(
            String name,
            String value,
            long maxAge
    ) {
        JwtProperties.Cookie c = props.getCookie();

        return ResponseCookie.from(name, value)
                .domain(c.getDomain())
                .httpOnly(c.isHttpOnly())
                .secure(c.isSecure())
                .path(c.getPath())
                .maxAge(maxAge)
                .sameSite(c.getSameSite())
                .build();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
        .setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
