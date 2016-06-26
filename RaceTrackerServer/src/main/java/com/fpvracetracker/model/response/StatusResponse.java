package com.fpvracetracker.model.response;

public class StatusResponse {
	public String status;

	public StatusResponse() {
		super();
	}

	public StatusResponse(String status) {
		this.status = status;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}