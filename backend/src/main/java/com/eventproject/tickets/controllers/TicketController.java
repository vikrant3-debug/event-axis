package com.eventproject.tickets.controllers;

import com.eventproject.tickets.domain.dtos.GetTicketReponseDto;
import com.eventproject.tickets.domain.dtos.ListTicketReponseDto;
import com.eventproject.tickets.mappers.TicketMapper;
import com.eventproject.tickets.services.QrCodeService;
import com.eventproject.tickets.services.TicketService;
import com.eventproject.tickets.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/v1/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final QrCodeService qrCodeService;
    private final TicketMapper ticketMapper;
    private final UserService userService;

    @GetMapping
    public Page<ListTicketReponseDto> listTickets(
            @AuthenticationPrincipal String email,
            Pageable pageable) {

        UUID userId = userService.getUserByEmail(email).getId();
        return ticketService.listTicketsForUser(userId, pageable)
                .map(ticketMapper::toListTicketReponseDto);
    }

    @GetMapping(path = "/{ticketId}")
    public ResponseEntity<GetTicketReponseDto> getTicket(
            @AuthenticationPrincipal String email,
            @PathVariable UUID ticketId) {

        UUID userId = userService.getUserByEmail(email).getId();
        return ticketService.getTicketForUser(userId, ticketId)
                .map(ticketMapper::toGetTicketReponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/{ticketId}/qr-codes")
    public ResponseEntity<byte[]> getTicketQrCode(
            @AuthenticationPrincipal String email,
            @PathVariable UUID ticketId) {

        UUID userId = userService.getUserByEmail(email).getId();
        byte[] qrCodeImage = qrCodeService.getQrCodeImageForUserAndTicket(userId, ticketId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentLength(qrCodeImage.length);

        return ResponseEntity.ok().headers(headers).body(qrCodeImage);
    }
}