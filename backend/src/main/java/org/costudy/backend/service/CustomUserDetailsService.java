package org.costudy.backend.service;

import org.costudy.backend.model.User;
import org.costudy.backend.model.UserPrincipal;
import org.costudy.backend.repo.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepo repo;

    private final Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    public CustomUserDetailsService(UserRepo userRepo) {
        this.repo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user;

        if(emailPattern.matcher(username).matches()) {
            user = repo.findByEmail(username);
        } else {
            user = repo.findByUsername(username);
        }

        if (user == null) {
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        System.out.println("User found");

        return new UserPrincipal(user);
    }
}
