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
@Table(name = "classes")
@NamedQueries({ @NamedQuery(name = Classs.FIND_ALL_BY_OWNER, query = "SELECT c FROM Classs c WHERE c.owner.uuid = :ownerUUID") })
public class Classs extends BaseEntity {

	private static final long serialVersionUID = 7908985696071301848L;
	public static final String FIND_ALL_BY_OWNER = "Classs.findAllByOwner";
	public static final String OWNER_UUID = "ownerUUID";

	public String name;
	@ManyToOne
	public User owner;

	public Classs() {
		super();
	}

	public Classs(String uuid, Date saved, Date synced, String name, User owner, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.name = name;
		this.owner = owner;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}
}