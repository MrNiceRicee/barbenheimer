import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
	pgTable,
	serial,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const USA_STATES_FULL = [
	"Alabama",
	"Alaska",
	// "American Samoa",
	"Arizona",
	"Arkansas",
	"California",
	"Colorado",
	"Connecticut",
	"Delaware",
	// "District of Columbia",
	// "Federated States of Micronesia",
	"Florida",
	"Georgia",
	// "Guam",
	"Hawaii",
	"Idaho",
	"Illinois",
	"Indiana",
	"Iowa",
	"Kansas",
	"Kentucky",
	"Louisiana",
	"Maine",
	// "Marshall Islands",
	"Maryland",
	"Massachusetts",
	"Michigan",
	"Minnesota",
	"Mississippi",
	"Missouri",
	"Montana",
	"Nebraska",
	"Nevada",
	"New Hampshire",
	"New Jersey",
	"New Mexico",
	"New York",
	"North Carolina",
	"North Dakota",
	// "Northern Mariana Islands",
	"Ohio",
	"Oklahoma",
	"Oregon",
	// "Palau",
	"Pennsylvania",
	// "Puerto Rico",
	"Rhode Island",
	"South Carolina",
	"South Dakota",
	"Tennessee",
	"Texas",
	"Utah",
	"Vermont",
	// "Virgin Island",
	"Virginia",
	"Washington",
	"West Virginia",
	"Wisconsin",
	"Wyoming",
] as const;

export const votes = pgTable(
	"barbenheimer_votes",
	{
		id: serial("id").primaryKey(),
		ip: varchar("ip", {
			length: 60,
		}).notNull(),
		state: varchar("state", {
			enum: USA_STATES_FULL,
			length: 60,
		}).notNull(),
		candidate: varchar("candidate", {
			enum: ["Barbie", "Oppenheimer"],
			length: 60,
		}).notNull(),
		message: varchar("message", {
			length: 280,
		}),
		votedAt: timestamp("voted_at").defaultNow(),
	},
	(votesTable) => {
		return {
			ipIndex: uniqueIndex("ip_index").on(votesTable.ip),
		};
	},
);

// export type Votes = InferModel<typeof votes>;
export type SelectVotes = InferSelectModel<typeof votes>;
export type InsertVotes = InferInsertModel<typeof votes>;
