package com.fpvracetracker.model.onlineEvent;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
public class OnlineEvent {

	// changes in this object may result in changes in the OnlineEvents query in
	// the CompetitionDao
	public static String parameterList = "description, location, dateFrom, dateTo, count(competitionpilots.uuid) as \"amountOfRegisteredPilots\", onlineResultKey, onlineRegistrationKey";
	public String description;
	public String location;
	public Date dateFrom;
	public Date dateTo;
	public int amountOfRegisteredPilots;
	@Id
	public String onlineResultKey;
	public String onlineRegistrationKey;

	public OnlineEvent() {
		super();
	}

	public OnlineEvent(String description, String location, Date dateFrom, Date dateTo, int amountOfRegisteredPilots, String onlineResultKey, String onlineRegistrationKey) {
		super();
		this.description = description;
		this.location = location;
		this.dateFrom = dateFrom;
		this.dateTo = dateTo;
		this.amountOfRegisteredPilots = amountOfRegisteredPilots;
		this.onlineResultKey = onlineResultKey;
		this.onlineRegistrationKey = onlineRegistrationKey;
	}

	public String getOnlineResultKey() {
		return onlineResultKey;
	}

	public void setOnlineResultKey(String onlineResultKey) {
		this.onlineResultKey = onlineResultKey;
	}

	public String getOnlineRegistrationKey() {
		return onlineRegistrationKey;
	}

	public void setOnlineRegistrationKey(String onlineRegistrationKey) {
		this.onlineRegistrationKey = onlineRegistrationKey;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Date getDateFrom() {
		return dateFrom;
	}

	public void setDateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
	}

	public Date getDateTo() {
		return dateTo;
	}

	public void setDateTo(Date dateTo) {
		this.dateTo = dateTo;
	}

	public int getAmountOfRegisteredPilots() {
		return amountOfRegisteredPilots;
	}

	public void setAmountOfRegisteredPilots(int amountOfRegisteredPilots) {
		this.amountOfRegisteredPilots = amountOfRegisteredPilots;
	}

}