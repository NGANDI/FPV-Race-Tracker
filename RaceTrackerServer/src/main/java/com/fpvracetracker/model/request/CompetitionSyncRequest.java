package com.fpvracetracker.model.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.frontend.User;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CompetitionSyncRequest extends BaseSyncRequest {

	public Competition[] data;

	public CompetitionSyncRequest() {
		super();
	}

	public CompetitionSyncRequest(User user, Competition[] data) {
		super(user, data);
	}

	public Competition[] getData() {
		return data;
	}

	public void setData(Competition[] data) {
		this.data = data;
	}

}