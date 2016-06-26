package com.fpvracetracker.model.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.Pilot;
import com.fpvracetracker.model.frontend.User;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PilotSyncRequest extends BaseSyncRequest {

	public Pilot[] data;

	public PilotSyncRequest() {
		super();
	}

	public PilotSyncRequest(User user, Pilot[] data) {
		super(user, data);
	}

	@Override
	public Pilot[] getData() {
		return data;
	}

	public void setData(Pilot[] data) {
		this.data = data;
	}

}