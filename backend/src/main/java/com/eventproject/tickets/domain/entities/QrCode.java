package com.eventproject.tickets.domain.entities;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="qr_codes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QrCode {
	
	@Id
	@Column(name="id",updatable = false,nullable=false)
	private UUID id;
	
	@Column(name="status",nullable = false)
	@Enumerated(EnumType.STRING)
	private QrCodeStatusEnum status;

	@Column(name="value",columnDefinition = "TEXT",nullable = false)
	private String value;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="ticket_id")
	private Ticket ticket;
	
	@CreatedDate
	@Column(name="created_at",updatable = false,nullable = false)
	private LocalDateTime createdAt;
	
	@LastModifiedDate
	@Column(name="updated_at",nullable = false)
	private LocalDateTime updatedAt;

	@Override
	public int hashCode() {
		return Objects.hash(createdAt, id, status, updatedAt, value);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		QrCode other = (QrCode) obj;
		return Objects.equals(createdAt, other.createdAt) && Objects.equals(id, other.id) && status == other.status
				&& Objects.equals(updatedAt, other.updatedAt) && Objects.equals(value, other.value);
	}
	
	
}
