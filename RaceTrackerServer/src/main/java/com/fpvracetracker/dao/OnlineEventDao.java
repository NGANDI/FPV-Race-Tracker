package com.fpvracetracker.dao;

import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.onlineEvent.OnlineEvent;

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class OnlineEventDao extends AbstractDao<Competition> {

	@SuppressWarnings("unchecked")
	public List<OnlineEvent> findByOnlineEventKey(String onlineEventKey) {
		if (onlineEventKey == null || onlineEventKey.length() < 1) {
			return null;
		}
		try {
			return (List<OnlineEvent>) entityManager.createNativeQuery(
					"SELECT " + OnlineEvent.parameterList
							+ " FROM users, competitions left join competitionpilots on competitionpilots.competition_uuid = competitions.uuid WHERE competitions.owner_uuid = users.uuid AND users.calendarKey = ? AND competitions.onlineEventPossible = true GROUP BY competitions.uuid;",
					OnlineEvent.class).setParameter(1, onlineEventKey).getResultList();
		} catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public List<OnlineEvent> findAllOnlineEvents() {
		try {
			return (List<OnlineEvent>) entityManager.createNativeQuery(
					"SELECT  " + OnlineEvent.parameterList
							+ " FROM competitions left join competitionpilots on competitionpilots.competition_uuid = competitions.uuid WHERE competitions.onlineEventPossible = true GROUP BY competitions.uuid;",
					OnlineEvent.class).getResultList();
		} catch (Exception ex) {
			return null;
		}
	}
}
