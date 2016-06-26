package com.fpvracetracker.model.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.BaseEntity;
import com.fpvracetracker.model.frontend.User;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BaseSyncRequest {

	public User user;
	public BaseEntity[] data;

	public BaseSyncRequest() {
	}

	public BaseSyncRequest(User user, BaseEntity[] data) {
		this.user = user;
		this.data = data;
	}

	public BaseEntity[] getData() {
		return this.data;
	}

}