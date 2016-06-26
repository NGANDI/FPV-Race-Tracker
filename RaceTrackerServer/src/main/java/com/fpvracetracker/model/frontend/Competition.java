package com.fpvracetracker.model.frontend;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "competitions")
@NamedQueries({ @NamedQuery(name = Competition.FIND_ALL_BY_OWNER, query = "SELECT c FROM Competition c WHERE c.owner.uuid = :ownerUUID"),
		@NamedQuery(name = Competition.FIND_BY_ONLINE_REGISTRATION_KEY, query = "SELECT c FROM Competition c WHERE c.onlineRegistrationPossible = true AND c.onlineRegistrationKey = :onlineRegistrationKey"),
		@NamedQuery(name = Competition.FIND_BY_ONLINE_RESULT_KEY, query = "SELECT c FROM Competition c WHERE c.onlineResultPossible = true AND c.onlineResultKey = :onlineResultKey") })
public class Competition extends BaseEntity {

	private static final long serialVersionUID = -6045281679184855304L;
	public static final String FIND_ALL_BY_OWNER = "Competition.findAllByOwner";
	public static final String FIND_BY_ONLINE_REGISTRATION_KEY = "Competition.findByOnlineRegistrationKey";
	public static final String FIND_BY_ONLINE_RESULT_KEY = "Competition.findByOnlineResultKey";
	public static final String OWNER_UUID = "ownerUUID";
	public static final String ONLINE_REGISTRATION_KEY = "onlineRegistrationKey";
	public static final String ONLINE_RESULT_KEY = "onlineResultKey";

	public String description;
	public String location;
	public Date dateFrom;
	public Date dateTo;

	public Date onlineRegistrationEnd;
	public boolean onlineRegistrationPossible;
	public String onlineRegistrationKey;
	public boolean onlineResultPossible;
	public String onlineResultKey;
	public boolean onlineEventPossible;

	@JsonManagedReference
	@OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.ALL }, orphanRemoval = true)
	public List<CompetitionPilot> pilots;

	@ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	public List<Classs> classes;

	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	public List<CompetitionConfig> competitionConfigs;

	@ManyToOne
	public User owner;

	public Competition() {
		super();
	}

	public Competition(String uuid, Date saved, Date synced, String description, String location, Date dateFrom, Date dateTo, List<CompetitionPilot> pilots, List<Classs> classes,
			List<CompetitionConfig> competitionConfigs, User owner, boolean deleted, String onlineRegistrationKey, boolean onlineRegistrationPossible, Date onlineRegistrationEnd,
			String onlineResultKey, boolean onlineResultPossible, boolean onlineEventPossible) {
		super(uuid, saved, synced, deleted);
		this.description = description;
		this.dateFrom = dateFrom;
		this.dateTo = dateTo;
		this.location = location;
		this.pilots = pilots;
		this.classes = classes;
		this.competitionConfigs = competitionConfigs;
		this.owner = owner;
		this.onlineRegistrationKey = onlineRegistrationKey;
		this.onlineRegistrationPossible = onlineRegistrationPossible;
		this.onlineRegistrationEnd = onlineRegistrationEnd;
		this.onlineRegistrationKey = onlineResultKey;
		this.onlineRegistrationPossible = onlineResultPossible;
		this.onlineEventPossible = onlineEventPossible;
	}

	public boolean isOnlineEventPossible() {
		return onlineEventPossible;
	}

	public void setOnlineEventPossible(boolean onlineEventPossible) {
		this.onlineEventPossible = onlineEventPossible;
	}

	public boolean isOnlineResultPossible() {
		return onlineResultPossible;
	}

	public void setOnlineResultPossible(boolean onlineResultPossible) {
		this.onlineResultPossible = onlineResultPossible;
	}

	public String getOnlineResultKey() {
		return onlineResultKey;
	}

	public void setOnlineResultKey(String onlineResultKey) {
		this.onlineResultKey = onlineResultKey;
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

	public String getOnlineRegistrationKey() {
		return onlineRegistrationKey;
	}

	public void setOnlineRegistrationKey(String onlineRegistrationKey) {
		this.onlineRegistrationKey = onlineRegistrationKey;
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

	public List<CompetitionPilot> getPilots() {
		return pilots;
	}

	public void setPilots(List<CompetitionPilot> pilots) {
		this.pilots = pilots;
	}

	public List<Classs> getClasses() {
		return classes;
	}

	public void setClasses(List<Classs> classes) {
		this.classes = classes;
	}

	public List<CompetitionConfig> getCompetitionConfigs() {
		return competitionConfigs;
	}

	public void setCompetitionConfigs(List<CompetitionConfig> competitionConfigs) {
		this.competitionConfigs = competitionConfigs;
	}

	public User getOwner() {
		return owner;
	}

	public Date getOnlineRegistrationEnd() {
		return onlineRegistrationEnd;
	}

	public void setOnlineRegistrationEnd(Date onlineRegistrationEnd) {
		this.onlineRegistrationEnd = onlineRegistrationEnd;
	}

	public boolean isOnlineRegistrationPossible() {
		return onlineRegistrationPossible;
	}

	public void setOnlineRegistrationPossible(boolean onlineRegistrationPossible) {
		this.onlineRegistrationPossible = onlineRegistrationPossible;
	}

	public void setOwner(User owner) {
		this.owner = owner;
		if (this.classes != null) {
			this.classes.forEach((classs) -> {
				classs.setOwner(owner);
			});
		}
	}

	public void prepairPilots() {
		if (pilots == null) {
			return;
		}
		int size = pilots.size();
		for (int i = 0; i < size; i++) {
			if (pilots.get(i).classs != null) {
				pilots.get(i).competition = this;
			} else {
				pilots.remove(i);
				i--;
				size = pilots.size();
			}
		}
	}

}