package org.costudy.backend.service;

import org.costudy.backend.model.User;
import org.costudy.backend.repo.UserRepo;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepo userRepo;

    public CustomOAuth2UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("Loading user...");
        OAuth2User oauthUser = super.loadUser(userRequest);

        String email = oauthUser.getAttribute("email");

        userRepo.findByEmail(email).orElseGet(() -> {
            System.out.println("Creating user..." + oauthUser.toString());
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider("GOOGLE");

            return userRepo.save(newUser);
        });

        return oauthUser;
    }
}
