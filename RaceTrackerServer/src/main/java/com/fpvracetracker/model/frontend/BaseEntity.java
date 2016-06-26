package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fpvracetracker.model.ServerBaseEntity;

@MappedSuperclass
public class BaseEntity extends ServerBaseEntity {

	@JsonIgnore
	private static final long serialVersionUID = -6084153882481126738L;
	public Date saved;
	public Date synced;
	public boolean deleted;

	public BaseEntity() {
	}

	public BaseEntity(String uuid, Date saved, Date synced, boolean deleted) {
		super(uuid);
		this.saved = saved;
		this.synced = synced;
		this.deleted = deleted;
	}

	public Date getSaved() {
		return saved;
	}

	public void setSaved(Date saved) {
		this.saved = saved;
	}

	public Date getSynced() {
		return synced;
	}

	public void setSynced(Date synced) {
		this.synced = synced;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

}