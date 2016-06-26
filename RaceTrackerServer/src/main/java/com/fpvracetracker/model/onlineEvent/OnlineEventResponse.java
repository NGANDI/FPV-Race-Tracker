package com.fpvracetracker.model.onlineEvent;

import java.util.List;

public class OnlineEventResponse {

	public List<OnlineEventGroup> onlineEventGroups;

	public OnlineEventResponse() {
		super();
	}

	public OnlineEventResponse(List<OnlineEventGroup> onlineEventGroups) {
		super();
		this.onlineEventGroups = onlineEventGroups;
	}

	public List<OnlineEventGroup> getOnlineEventGroups() {
		return onlineEventGroups;
	}

	public void setOnlineEventGroups(List<OnlineEventGroup> onlineEventGroups) {
		this.onlineEventGroups = onlineEventGroups;
	}

}
