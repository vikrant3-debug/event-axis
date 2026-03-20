package com.eventproject.tickets.repositories;

import com.eventproject.tickets.domain.entities.Ticket;
import com.eventproject.tickets.domain.entities.TicketType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {

    @Query("SELECT tt FROM TicketType tt WHERE tt.id=:id")
    @Lock(LockModeType.PESSIMISTIC_READ)
    Optional<TicketType> findByIdWithLock(@Param("id") UUID id);

}
