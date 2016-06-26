package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.compositeKeys.CompetitionPilotClassPK;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "competitionpilotclass")
@IdClass(CompetitionPilotClassPK.class)
public class CompetitionPilotClasss extends BaseEntity {

	private static final long serialVersionUID = 7908985696071301848L;
	public static final String FIND_ALL_BY_OWNER = "Classs.findAllByOwner";
	public static final String OWNER_UUID = "ownerUUID";

	public String name;

	@Id
	public String uuid;

	@JsonIgnore
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	public Long id;

	public CompetitionPilotClasss() {
		super();
	}

	public CompetitionPilotClasss(String name, Date saved, Date synced, String uuid, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.name = name;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}