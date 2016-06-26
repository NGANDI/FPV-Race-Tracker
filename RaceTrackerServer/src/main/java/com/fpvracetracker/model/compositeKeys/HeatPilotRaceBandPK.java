package com.fpvracetracker.model.compositeKeys;

import java.io.Serializable;

public class HeatPilotRaceBandPK implements Serializable {

	private static final long serialVersionUID = 9134291752379972338L;
	public String uuid;
	public Long id;

	public HeatPilotRaceBandPK() {
		super();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
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
		HeatPilotRaceBandPK other = (HeatPilotRaceBandPK) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}

}