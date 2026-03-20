package com.eventproject.tickets.services;

import com.eventproject.tickets.domain.entities.Role;
import com.eventproject.tickets.domain.entities.User;

public interface UserService {

    User getUserByEmail(String email);

    User registerUser(String name, String email, String rawPassword, Role role);

}