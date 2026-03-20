package com.eventproject.tickets.services.impl;

import com.eventproject.tickets.domain.entities.Ticket;
import com.eventproject.tickets.domain.entities.TicketStatusEnum;
import com.eventproject.tickets.domain.entities.TicketType;
import com.eventproject.tickets.domain.entities.User;
import com.eventproject.tickets.exceptions.TicketTypeNotFoundException;
import com.eventproject.tickets.exceptions.TicketsSoldOutException;
import com.eventproject.tickets.exceptions.UserNotFoundException;
import com.eventproject.tickets.repositories.TicketRepository;
import com.eventproject.tickets.repositories.TicketTypeRepository;
import com.eventproject.tickets.repositories.UserRepository;
import com.eventproject.tickets.services.EventService;
import com.eventproject.tickets.services.QrCodeService;
import com.eventproject.tickets.services.TicketTypeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final QrCodeService qrCodeService;

    @Override
    @Transactional
    public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(
                String.format("User with id %s not found", userId)
        ));

        TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId).orElseThrow(() -> new TicketTypeNotFoundException(
                String.format("Ticket type with id %s not found ", ticketTypeId)
        ));

        int purchasedTickets = ticketRepository.countByTicketTypeId(ticketTypeId);
        Integer totalAvailable = ticketType.getTotalAvailable();

        if(purchasedTickets+1 > totalAvailable){
            throw new TicketsSoldOutException();
        }

        Ticket ticket = new Ticket();

        ticket.setStatus(TicketStatusEnum.PURCHASED);
        ticket.setTicketType(ticketType);
        ticket.setPurchaser(user);

        Ticket savedTicket = ticketRepository.save(ticket);
        qrCodeService.generateQrCode(savedTicket);

        return ticketRepository.save(savedTicket);
    }
}
