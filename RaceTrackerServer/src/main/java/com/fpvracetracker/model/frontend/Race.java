package com.fpvracetracker.model.frontend;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "races")
@NamedQueries({ @NamedQuery(name = Race.FIND_ALL_BY_OWNER, query = "SELECT r FROM Race r WHERE r.owner.uuid = :ownerUUID"),
		@NamedQuery(name = Race.FIND_ALL_BY_COMPETITION_UUID, query = "SELECT r FROM Race r WHERE r.competitionUUID = :competitionUUID") })
public class Race extends BaseEntity {

	private static final long serialVersionUID = -8628137646940204710L;
	public static final String FIND_ALL_BY_OWNER = "Race.findAllByOwner";
	public static final String FIND_ALL_BY_COMPETITION_UUID = "Race.findAllByCompetitionUUID";
	public static final String OWNER_UUID = "ownerUUID";
	public static final String COMPETITION_UUID = "competitionUUID";

	public String competitionUUID;
	public String format;
	public String type;
	@ManyToOne
	public Classs classs;
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	public List<Round> rounds;
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	public List<RoundResultEntry> qualificationResults;
	@ManyToOne
	public User owner;

	public Race() {
		super();
	}

	public Race(String uuid, Date saved, Date synced, String competitionUUID, String format, String type, Classs classs, List<Round> rounds, List<RoundResultEntry> qualificationResults, User owner,
			boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.competitionUUID = competitionUUID;
		this.format = format;
		this.type = type;
		this.classs = classs;
		this.rounds = rounds;
		this.qualificationResults = qualificationResults;
		this.owner = owner;
	}

	public String getCompetitionUUID() {
		return competitionUUID;
	}

	public void setCompetitionUUID(String competitionUUID) {
		this.competitionUUID = competitionUUID;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Classs getClasss() {
		return classs;
	}

	public void setClasss(Classs classs) {
		this.classs = classs;
	}

	public List<Round> getRounds() {
		return rounds;
	}

	public void setRounds(List<Round> rounds) {
		this.rounds = rounds;
	}

	public List<RoundResultEntry> getQualificationResults() {
		return qualificationResults;
	}

	public void setQualificationResults(List<RoundResultEntry> qualificationResults) {
		this.qualificationResults = qualificationResults;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

}