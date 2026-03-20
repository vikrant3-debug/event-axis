package com.eventproject.tickets.services;

import com.eventproject.tickets.domain.CreateEventRequest;
import com.eventproject.tickets.domain.UpdateEventRequest;
import com.eventproject.tickets.domain.entities.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface EventService {
    Event createEvent(UUID organizerId,CreateEventRequest event);
    Page<Event> listEventsForOrganizer(UUID organizerId, Pageable pageable);
    Optional<Event> getEventForOrganizer(UUID organizerId,UUID id);

    Event updateEventForOrganizer(UUID organizerId, UUID id, UpdateEventRequest event);
    void deleteEventForOrganizer(UUID organizerId,UUID id);

    Page<Event> listPublishedEvent(Pageable pageable);
    Page<Event> searchPublishedEvent(String query,Pageable pageable);

    Optional<Event> getPublishedEvent(UUID id);

}














