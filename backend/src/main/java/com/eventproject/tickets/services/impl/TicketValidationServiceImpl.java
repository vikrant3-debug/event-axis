package com.eventproject.tickets.services.impl;

import com.eventproject.tickets.domain.entities.*;
import com.eventproject.tickets.exceptions.QrCodeNotFoundException;
import com.eventproject.tickets.exceptions.TicketNotFoundException;
import com.eventproject.tickets.exceptions.TicketTypeNotFoundException;
import com.eventproject.tickets.repositories.QrCodeRepository;
import com.eventproject.tickets.repositories.TicketRepository;
import com.eventproject.tickets.repositories.TicketValidationRepository;
import com.eventproject.tickets.services.TicketValidationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketValidationServiceImpl implements TicketValidationService {

    private final QrCodeRepository qrCodeRepository;
    private final TicketRepository ticketRepository;
    private final TicketValidationRepository ticketValidationRepository;


    @Override
    public TicketValidation validateTicketByQrCode(UUID qrCodeId) {

        QrCode qrCode = qrCodeRepository.findByIdAndStatus(qrCodeId, QrCodeStatusEnum.ACTIVE)
                .orElseThrow(() -> new QrCodeNotFoundException(
                        String.format("Qr code with id '%s' not found ", qrCodeId)
                ));

        Ticket ticket = qrCode.getTicket();

        return validateTicket(ticket,TicketValidationMethod.QR_SCAN);
    }

    private TicketValidation validateTicket(Ticket ticket, TicketValidationMethod ticketValidationMethod) {
        TicketValidation ticketValidation = new TicketValidation();

        ticketValidation.setTicket(ticket);
        ticketValidation.setValidationMethod(ticketValidationMethod);

        TicketValidationStatusEnum ticketValidationStatus = ticket.getValidations()
                .stream()
                .filter(v -> TicketValidationStatusEnum.VALID.equals(v.getStatus()))
                .findFirst()
                .map(v -> TicketValidationStatusEnum.INVALID)
                .orElse(TicketValidationStatusEnum.VALID);

        ticketValidation.setStatus(ticketValidationStatus);

        return ticketValidationRepository.save(ticketValidation);
    }

    @Override
    public TicketValidation validateTicketManually(UUID ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                                        .orElseThrow(TicketNotFoundException::new);

        return validateTicket(ticket,TicketValidationMethod.MANUAL);
    }



}



