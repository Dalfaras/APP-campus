'use server';

/**
 * @fileOverview Personalized event recommendations flow using Genkit.
 *
 * - getEventRecommendations - A function that takes a user profile and returns event recommendations.
 * - EventRecommendationsInput - The input type for the getEventRecommendations function.
 * - EventRecommendationsOutput - The return type for the getEventRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EventRecommendationsInputSchema = z.object({
  userProfile: z.object({
    interests: z.array(z.string()).describe('List of user interests.'),
    skills: z.array(z.string()).describe('List of user skills.'),
    courses: z.array(z.string()).describe('List of courses the user is taking.'),
  }).describe('User profile containing interests, skills, and courses.'),
  events: z.array(z.object({
    type: z.enum(['Travail', 'Chill', 'Mixte']).describe('Type of event (Travail, Chill, Mixte).'),
    category: z.string().describe('Category of the event (e.g., révision BTS, foot).'),
    title: z.string().describe('Title of the event.'),
    description: z.string().describe('Description of the event.'),
    keywords: z.array(z.string()).optional().describe('Keywords associated with the event.'),
  })).describe('List of events to consider for recommendations.'),
});
export type EventRecommendationsInput = z.infer<typeof EventRecommendationsInputSchema>;

const EventRecommendationsOutputSchema = z.array(z.object({
  title: z.string().describe('Title of the recommended event.'),
  reason: z.string().describe('Reason why this event is recommended for the user.'),
}));
export type EventRecommendationsOutput = z.infer<typeof EventRecommendationsOutputSchema>;

export async function getEventRecommendations(input: EventRecommendationsInput): Promise<EventRecommendationsOutput> {
  return eventRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eventRecommendationsPrompt',
  input: {schema: EventRecommendationsInputSchema},
  output: {schema: EventRecommendationsOutputSchema},
  prompt: `You are an AI assistant that recommends events to students based on their profile and event details.

  User Profile:
  Interests: {{userProfile.interests}}
  Skills: {{userProfile.skills}}
  Courses: {{userProfile.courses}}

  Events:
  {{#each events}}
  Type: {{type}}
  Category: {{category}}
  Title: {{title}}
  Description: {{description}}
  Keywords: {{keywords}}
  {{/each}}

  Recommend events that are most relevant to the user based on their interests, skills, and courses. Provide a reason for each recommendation.
  Format the output as a JSON array of objects with the title of the event and the reason for the recommendation.`,
});

const eventRecommendationsFlow = ai.defineFlow(
  {
    name: 'eventRecommendationsFlow',
    inputSchema: EventRecommendationsInputSchema,
    outputSchema: EventRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
