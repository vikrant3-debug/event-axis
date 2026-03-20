package com.eventproject.tickets.services;

import com.eventproject.tickets.domain.entities.TicketValidation;
import java.util.UUID;

public interface TicketValidationService {
    TicketValidation validateTicketByQrCode(UUID qrCodeId);
    TicketValidation validateTicketManually(UUID ticketId);

}
