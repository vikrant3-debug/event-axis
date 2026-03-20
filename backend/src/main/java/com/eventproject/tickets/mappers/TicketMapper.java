package com.eventproject.tickets.mappers;

import com.eventproject.tickets.domain.dtos.GetTicketReponseDto;
import com.eventproject.tickets.domain.dtos.ListTicketReponseDto;
import com.eventproject.tickets.domain.dtos.ListTicketTicketTypeResponseDto;
import com.eventproject.tickets.domain.entities.Ticket;
import com.eventproject.tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {

    ListTicketReponseDto toListTicketReponseDto(Ticket ticket);
    ListTicketTicketTypeResponseDto toListTicketTicketTypeResponseDto(TicketType ticketType);

    @Mapping(target = "price",source = "ticket.ticketType.price")
    @Mapping(target = "description",source = "ticket.ticketType.description")
    @Mapping(target = "eventName",source = "ticket.ticketType.event.name")
    @Mapping(target = "eventVenue",source = "ticket.ticketType.event.venue")
    @Mapping(target = "eventStart",source = "ticket.ticketType.event.start")
    @Mapping(target = "eventEnd",source = "ticket.ticketType.event.end")
    GetTicketReponseDto toGetTicketReponseDto(Ticket ticket);

}
