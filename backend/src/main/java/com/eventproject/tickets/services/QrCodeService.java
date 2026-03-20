package com.eventproject.tickets.services;

import com.eventproject.tickets.domain.entities.QrCode;
import com.eventproject.tickets.domain.entities.Ticket;
import java.util.UUID;

public interface QrCodeService {

    QrCode generateQrCode(Ticket ticket);

    byte[] getQrCodeImageForUserAndTicket(UUID userId,UUID ticketId);


}
