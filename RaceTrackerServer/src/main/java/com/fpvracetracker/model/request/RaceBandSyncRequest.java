package com.fpvracetracker.model.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.RaceBand;
import com.fpvracetracker.model.frontend.User;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RaceBandSyncRequest extends BaseSyncRequest {

	public RaceBand[] data;

	public RaceBandSyncRequest() {
		super();
	}

	public RaceBandSyncRequest(User user, RaceBand[] data) {
		super(user, data);
	}

	public RaceBand[] getData() {
		return data;
	}

	public void setData(RaceBand[] data) {
		this.data = data;
	}

}