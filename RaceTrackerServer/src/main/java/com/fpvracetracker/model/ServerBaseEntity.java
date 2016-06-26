package com.fpvracetracker.model;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class ServerBaseEntity implements Serializable {

	private static final long serialVersionUID = -5479083606152663210L;
	@Id
	public String uuid;

	public ServerBaseEntity() {
	}

	public ServerBaseEntity(String uuid) {
		this.uuid = (uuid == null ? generateServerUUID() : uuid);
	}

	public static String generateServerUUID() {
		return "x_" + "" + new Date().getTime() + "" + UUID.randomUUID().toString();
	}
}