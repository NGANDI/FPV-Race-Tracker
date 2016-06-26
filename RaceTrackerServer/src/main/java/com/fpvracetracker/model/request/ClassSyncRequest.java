package com.fpvracetracker.model.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.User;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ClassSyncRequest extends BaseSyncRequest {

	public Classs[] data;

	public ClassSyncRequest() {
		super();
	}

	public ClassSyncRequest(User user, Classs[] data) {
		super(user, data);
	}

	public Classs[] getData() {
		return data;
	}

	public void setData(Classs[] data) {
		this.data = data;
	}

}