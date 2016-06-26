package com.fpvracetracker.model.onlineRegistration;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.BaseEntity;
import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.Competition;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "onlineRegistrations")
@NamedQueries({ @NamedQuery(name = OnlineRegistration.FIND_BY_COMPETITION_UUID, query = "SELECT p FROM OnlineRegistration p WHERE p.competition.uuid = :competitionUUID"),
		@NamedQuery(name = OnlineRegistration.FIND_BY_UUID, query = "SELECT p FROM OnlineRegistration p WHERE p.uuid = :uuid") })
public class OnlineRegistration extends BaseEntity {

	public static final String FIND_BY_COMPETITION_UUID = "OnlineRegistration.findByCompetitionUUID";
	public static final String COMPETITION_UUID = "competitionUUID";
	public static final String FIND_BY_UUID = "OnlineRegistration.findByUUID";
	public static final String UUID = "uuid";
	public static final String DELETE_BY_KEY_AND_CLASS = "OnlineRegistration.deleteByKeyAndClass";
	public static final String CLASS_UUID = "competitionUUID";

	private static final long serialVersionUID = -908216454607323815L;
	public String firstName;
	public String lastName;
	public String alias;
	public String phone;
	public String country;
	public String email;
	public String club;
	public String deviceId;
	@ManyToMany(fetch = FetchType.EAGER)
	public List<Classs> classes;
	@JsonBackReference
	@ManyToOne
	public Competition competition;

	public OnlineRegistration() {
		super();
	}

	public OnlineRegistration(String uuid, Date saved, Date synced, String firstName, String lastName, String alias, String phone, String country, String email, String club, List<Classs> classes,
			boolean deleted, Competition competition, String deviceId) {
		super(uuid, saved, synced, deleted);
		this.firstName = firstName;
		this.lastName = lastName;
		this.alias = alias;
		this.phone = phone;
		this.country = country;
		this.email = email;
		this.club = club;
		this.classes = classes;
		this.uuid = uuid;
		this.competition = competition;
		this.deviceId = deviceId;
	}

	public String getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}

	public Competition getCompetition() {
		return competition;
	}

	public void setCompetition(Competition competition) {
		this.competition = competition;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getClub() {
		return club;
	}

	public void setClub(String club) {
		this.club = club;
	}

	public List<Classs> getClasses() {
		return classes;
	}

	public void setClasses(List<Classs> classes) {
		this.classes = classes;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

}
