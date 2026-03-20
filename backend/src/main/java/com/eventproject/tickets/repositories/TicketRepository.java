package com.eventproject.tickets.repositories;

import com.eventproject.tickets.domain.entities.QrCode;
import com.eventproject.tickets.domain.entities.Ticket;
import com.eventproject.tickets.domain.entities.TicketType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    int countByTicketTypeId(UUID id);
    Page<Ticket> findByPurchaserId(UUID purchaserId, Pageable pageable);
    Optional<Ticket> findByIdAndPurchaserId(UUID id,UUID purchaserId);



}
