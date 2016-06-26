package com.fpvracetracker.model;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.User;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "transferRequests")
@NamedQueries({ @NamedQuery(name = TransferRequest.FIND_BY_VERIFICATION_CODE, query = "SELECT r FROM TransferRequest r WHERE r.verificationCode = :verificationCode") })
public class TransferRequest extends ServerBaseEntity {

	private static final long serialVersionUID = 4881506326238177747L;

	public static final String FIND_BY_VERIFICATION_CODE = "TransferRequest.findByVerificationCode";
	public static final String VERIFICATION_CODE = "verificationCode";

	public Date timestamp;
	@ManyToOne
	public User user;
	public String verificationCode;

	public TransferRequest() {
		super();
	}

	public TransferRequest(User user) {
		super(null);
		this.user = user;
		this.timestamp = new Date();
		this.verificationCode = UUID.randomUUID().toString();
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getVerificationCode() {
		return verificationCode;
	}

	public void setVerificationCode(String code) {
		this.verificationCode = code;
	}

}