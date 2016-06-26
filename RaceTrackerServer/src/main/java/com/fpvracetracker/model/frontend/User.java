package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "users")
@NamedQueries({ @NamedQuery(name = User.FIND_BY_EMAIL, query = "SELECT u FROM User u WHERE u.email = :email") })
public class User extends BaseEntity {

	private static final long serialVersionUID = -682840313679593173L;

	public static final String FIND_BY_EMAIL = "User.findByEmail";

	public static final String EMAIL = "email";

	public String name;
	// public String passwordHash;
	public String email;
	public String calendarKey;

	public User() {
		super();
	}

	public User(String uuid, Date saved, Date synced, String name,
			/* String passwordHash, */String email, boolean deleted, String calendarKey) {
		super(uuid, saved, synced, deleted);
		this.name = name;
		// this.passwordHash = passwordHash;
		this.email = email;
		this.calendarKey = calendarKey;
	}

	public String getCalendarKey() {
		return calendarKey;
	}

	public void setCalendarKey(String calendarKey) {
		this.calendarKey = calendarKey;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	// public String getPasswordHash() {
	// return passwordHash;
	// }
	//
	// public void setPasswordHash(String passwordHash) {
	// this.passwordHash = passwordHash;
	// }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}