package com.fpvracetracker.model.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.Race;
import com.fpvracetracker.model.frontend.User;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserSyncRequest extends BaseSyncRequest {

	public Race[] data;

	public UserSyncRequest() {
		super();
	}

	public UserSyncRequest(User user, Race[] data) {
		super(user, data);
	}

	public Race[] getData() {
		return data;
	}

	public void setData(Race[] data) {
		this.data = data;
	}

}