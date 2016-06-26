package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "raceBands")
@NamedQueries({
		@NamedQuery(name = RaceBand.FIND_ALL_BY_OWNER, query = "SELECT rb FROM RaceBand rb WHERE rb.owner.uuid = :ownerUUID") })
public class RaceBand extends BaseEntity {

	private static final long serialVersionUID = -6454074438030804830L;
	public static final String FIND_ALL_BY_OWNER = "RaceBand.findAllByOwner";
	public static final String OWNER_UUID = "ownerUUID";
	@ManyToOne
	public User owner;

	public String value;

	public RaceBand() {
		super();
	}

	public RaceBand(String uuid, Date saved, Date synced, String value, User owner, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.value = value;
		this.owner = owner;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

}