package com.eventproject.tickets.controllers;

import com.eventproject.tickets.domain.CreateEventRequest;
import com.eventproject.tickets.domain.UpdateEventRequest;
import com.eventproject.tickets.domain.dtos.*;
import com.eventproject.tickets.domain.entities.Event;
import com.eventproject.tickets.mappers.EventMapper;
import com.eventproject.tickets.services.EventService;
import com.eventproject.tickets.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventMapper eventMapper;
    private final EventService eventService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CreateEventResponseDto> createEvent(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody CreateEventRequestDto createEventRequestDto)
    {
        CreateEventRequest createEventRequest = eventMapper.fromDto(createEventRequestDto);
        UUID userId = userService.getUserByEmail(email).getId();
        Event createdEvent = eventService.createEvent(userId, createEventRequest);
        CreateEventResponseDto createEventResponseDto = eventMapper.toDto(createdEvent);

        return new ResponseEntity<>(createEventResponseDto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ListEventResponseDto>> listEvents(
            @AuthenticationPrincipal String email,
            Pageable pageable)
    {
        UUID userId = userService.getUserByEmail(email).getId();
        Page<Event> events = eventService.listEventsForOrganizer(userId, pageable);

        return ResponseEntity.ok(events.map(eventMapper::toListEventResponseDto));
    }

    @GetMapping(path = "/{eventId}")
    public ResponseEntity<GetEventDetailsResponseDto> getEvent(
            @AuthenticationPrincipal String email,
            @PathVariable UUID eventId)
    {
        UUID userId = userService.getUserByEmail(email).getId();

        return eventService.getEventForOrganizer(userId, eventId)
                .map(eventMapper::toGetEventDetailsResponseDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(path = "/{eventId}")
    public ResponseEntity<UpdateEventResponseDto> updateEvent(
            @AuthenticationPrincipal String email,
            @PathVariable UUID eventId,
            @Valid @RequestBody UpdateEventResponseDto updateEventRequestDto)
    {
        UpdateEventRequest updateEventRequest = eventMapper.fromDto(updateEventRequestDto);
        UUID userId = userService.getUserByEmail(email).getId();
        Event updatedEvent = eventService.updateEventForOrganizer(userId, eventId, updateEventRequest);
        UpdateEventResponseDto updateEventResponseDto = eventMapper.toUpdateEventResponseDto(updatedEvent);

        return ResponseEntity.ok(updateEventResponseDto);
    }

    @DeleteMapping(path = "/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @AuthenticationPrincipal String email,
            @PathVariable UUID eventId)
    {
        UUID userId = userService.getUserByEmail(email).getId();
        eventService.deleteEventForOrganizer(userId, eventId);

        return ResponseEntity.noContent().build();
    }
}