package com.eventproject.tickets.controllers;

import com.eventproject.tickets.config.JwtUtil;
import com.eventproject.tickets.domain.dtos.AuthResponseDto;
import com.eventproject.tickets.domain.dtos.LoginRequestDto;
import com.eventproject.tickets.domain.dtos.SignupRequestDto;
import com.eventproject.tickets.domain.entities.User;
import com.eventproject.tickets.services.impl.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserServiceImpl userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponseDto signup(@RequestBody @Valid SignupRequestDto request) {
        userService.registerUser(request.getName(), request.getEmail(), request.getPassword(), request.getRole());
        User user = userService.getUserByEmail(request.getEmail());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponseDto(token, user.getRole().name(), user.getEmail());
    }

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody @Valid LoginRequestDto request) {
        User user = userService.getUserByEmail(request.getEmail());
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponseDto(token, user.getRole().name(), user.getEmail());
    }
}