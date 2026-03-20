package com.eventproject.tickets.services;

import com.eventproject.tickets.domain.entities.Ticket;

import java.util.UUID;

public interface TicketTypeService {

    Ticket purchaseTicket(UUID userId,UUID ticketTypeId);
}
