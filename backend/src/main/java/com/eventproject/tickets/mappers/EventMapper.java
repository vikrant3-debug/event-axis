package com.eventproject.tickets.mappers;

import com.eventproject.tickets.domain.CreateEventRequest;
import com.eventproject.tickets.domain.CreateTicketTypeRequest;
import com.eventproject.tickets.domain.UpdateEventRequest;
import com.eventproject.tickets.domain.UpdateTicketTypeRequest;
import com.eventproject.tickets.domain.dtos.*;
import com.eventproject.tickets.domain.entities.Event;
import com.eventproject.tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {
    CreateEventRequest fromDto(CreateEventRequestDto dto);
    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);
    CreateEventResponseDto toDto(Event event);

    ListEventTicketTypeResponseDto toDto(TicketType ticketType);
    ListEventResponseDto toListEventResponseDto(Event event);

    GetEventDetailsTicketTypesResponseDto toGetEventDetailsTicketTypesResponseDto(TicketType ticketType);
    GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);

    UpdateTicketTypeRequest fromDto(UpdateTicketTypeRequestDto dto);
    UpdateEventRequest fromDto(UpdateEventRequestDto dto);

    UpdateTicketTypeResponseDto toUpdateTicketTypeResponseDto(TicketType ticketType);
    UpdateEventResponseDto toUpdateEventResponseDto(Event event);

    ListPublishedEventResponseDto toListPublishedEventResponseDto(Event event);

    GetPublishedEventDetailsTicketTypesResponseDto toGetPublishedEventDetailsTicketTypesResponseDto(TicketType ticketType);
    GetPublishedEventDetailsResponseDto toGetPublishedEventDetailsResponseDto(Event event);

}
