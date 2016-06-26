package com.fpvracetracker.model.compositeKeys;

import java.io.Serializable;

import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.Competition;

public class OnlineRegistrationPilotPK implements Serializable {

	private static final long serialVersionUID = -8023794326911318529L;
	public String uuid;
	public Classs classs;
	public Competition competition;

	public OnlineRegistrationPilotPK() {
		super();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((classs == null) ? 0 : classs.hashCode());
		result = prime * result + ((competition == null) ? 0 : competition.hashCode());
		result = prime * result + ((uuid == null) ? 0 : uuid.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CompetitionPilotPK other = (CompetitionPilotPK) obj;
		if (classs == null) {
			if (other.classs != null)
				return false;
		} else if (!classs.equals(other.classs))
			return false;
		if (competition == null) {
			if (other.competition != null)
				return false;
		} else if (!competition.equals(other.competition))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}

}