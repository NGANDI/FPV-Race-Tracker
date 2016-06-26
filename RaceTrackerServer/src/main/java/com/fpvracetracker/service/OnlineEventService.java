package com.fpvracetracker.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.OnlineEventDao;
import com.fpvracetracker.model.onlineEvent.OnlineEvent;
import com.fpvracetracker.model.onlineEvent.OnlineEventGroup;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class OnlineEventService {

	@Autowired
	private OnlineEventDao onlineEventDao;

	@Transactional
	public List<OnlineEventGroup> getOnlineEventsByKey(String key) {
		List<OnlineEvent> events;
		if (key.equalsIgnoreCase("ALL")) {
			events = onlineEventDao.findAllOnlineEvents();
		} else {
			events = onlineEventDao.findByOnlineEventKey(key);
		}

		if (events == null) {
			return null;
		}

		List<OnlineEventGroup> eventGroups = new LinkedList<OnlineEventGroup>();

		for (OnlineEvent onlineEvent : events) {
			System.out.println(onlineEvent.description);
			for (Date month : getMonthsFromEvent(onlineEvent)) {
				OnlineEventGroup eventGroup = getGroupForMonth(eventGroups, month);
				eventGroup.addOnlineEvent(onlineEvent);
			}
		}

		return eventGroups;
	}

	private OnlineEventGroup getGroupForMonth(List<OnlineEventGroup> eventGroups, Date month) {
		for (OnlineEventGroup eventGroup : eventGroups) {
			if (eventGroup.month.equals(month)) {
				return eventGroup;
			}
		}
		OnlineEventGroup oeg = new OnlineEventGroup(new LinkedList<OnlineEvent>(), month);
		eventGroups.add(oeg);
		return oeg;
	}

	private List<Date> getMonthsFromEvent(OnlineEvent event) {
		List<Date> months = new ArrayList<Date>();

		Calendar c = Calendar.getInstance();
		Date d = event.dateFrom;
		while (!d.after(event.dateTo)) {
			c.setTime(d);
			c.set(c.get(Calendar.YEAR), c.get(Calendar.MONTH), 1, 1, 1, 1);
			Date month = c.getTime();
			if (!months.contains(month)) {
				months.add(month);
			}
			c.setTime(d);
			c.add(Calendar.DATE, 1);
			d = c.getTime();
		}

		return months;
	}
}
