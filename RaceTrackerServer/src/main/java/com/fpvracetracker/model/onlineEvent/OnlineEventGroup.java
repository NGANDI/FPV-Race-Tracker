package com.fpvracetracker.model.onlineEvent;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class OnlineEventGroup {

	public Date month;
	public List<OnlineEvent> onlineEvents;

	public OnlineEventGroup() {
		super();
	}

	public OnlineEventGroup(List<OnlineEvent> onlineEvents, Date month) {
		super();
		this.month = month;
		this.onlineEvents = onlineEvents;
	}

	public void addOnlineEvent(OnlineEvent onlineEvent) {
		if (onlineEvents != null) {
			onlineEvents.add(onlineEvent);
		} else {
			onlineEvents = new LinkedList<OnlineEvent>();
			onlineEvents.add(onlineEvent);
		}
	}

	public Date getMonth() {
		return month;
	}

	public void setMonth(Date month) {
		this.month = month;
	}

	public List<OnlineEvent> getOnlineEvents() {
		return onlineEvents;
	}

	public void setOnlineEvents(List<OnlineEvent> onlineEvents) {
		this.onlineEvents = onlineEvents;
	}

}
