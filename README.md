# Creator Mind Growth

An agent that reads a YouTube channel's comments, remembers what viewers keep
asking for, and keeps a record of whether its own advice worked.

Built on Minds by Animoca Brands for Creative Minds Jam #1, track 1.

## What it does

1. Reads every comment on a channel.
2. Groups the ones asking for the same thing.
3. Notices when a small ask starts repeating.
4. Tells the creator what to make next, and why.
5. Writes down what it told them, and when.
6. Checks how the video did once it is published.
7. Says whether it was right or wrong.
8. Changes how it reads the audience because of it.

Steps 5 to 8 are the part that needs a Mind. An agent that forgets can still
summarise comments. It cannot tell you it was wrong in March.

## Where the Mind sits

The app fetches. The Mind decides.

| The app does | The Mind does |
| --- | --- |
| Reads the comments | Decides what they mean |
| Counts what repeats | Decides which repeat matters |
| Keeps the list of past calls | Makes the call, and explains why |
| Wakes up on a timer | Decides if there is anything worth saying |
| Stores raw numbers | Holds the understanding |

There is no memory endpoint in the Minds API. Nothing is written to memory
directly. The app talks to the Mind in plain sentences and the Mind remembers.
Every judgement in the right column disappears if the Mind forgets.

## Proving it remembers

Each creator gets their own Mind and one conversation alias that never closes.
Opening a fresh alias against the same Mind and asking what to make next
returns an answer built on months of earlier conversation, with nothing
passed in.

## The standby model

The Mind is what makes this product work. It is the only part that remembers
across sessions, and every judgement in the right-hand column above is its.

A Mind spends cognition to think. When that balance runs out the Mind stops
answering, and the app would otherwise be dead in the water. So there is a
standby model behind it: Azure OpenAI GPT-4o.

It is a fallback, not the product.

- The Mind is asked first, every time.
- The standby model is only used when the Mind does not answer, and only if
  Azure keys are present in `.env`.
- Without Azure keys the app simply reports that the Mind is out of cognition.

Every call records which one answered it, and the interface says so on the
card and in the track record. Nothing is hidden behind the scenes.

What the standby model cannot do is the point of the product. It has no memory
of this creator, no record of what it advised last month, and no way to mark
its own past calls. Those come from the Mind. When the standby model answers,
you get a suggestion; when the Mind answers, you get a suggestion from
something that remembers being wrong before.

Set these to enable it:

```
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT=your-gpt-4o-deployment
AZURE_OPENAI_API_VERSION=2024-10-21
```

## Running it

Node 22 or newer.

```
npm install
cp .env.example .env
npm run dev
```

Fill in `.env`:

- `MINDS_BUILDER_API_KEY` from the Builder console at build.hellominds.ai
- `YOUTUBE_API_KEY` from Google Cloud, YouTube Data API v3 enabled
- `MINDS_ARCHETYPE` optional, defaults to `mastermind`

Then open the dashboard and paste a channel link. No login is needed because
comments and view counts are public.

## How it is laid out

```
app/            pages and routes
  api/channel     read a channel, wake the Mind, teach it the history
  api/call        ask the Mind what to make next
  api/verdict     ask the Mind to judge a past call
  api/dashboard   read what is stored
components/
  landing/        hero and features
  dashboard/      sidebar and panels
  ui/             shared pieces
  icons/          svgs
lib/
  youtube/        readChannel, readVideos, readComments
  asks/           findAsks, countPhrases, splitByMonth
  minds/          wakeMind, askMind, teachMindHistory
  store/          saved calls and verdicts
  errors/         plain wording for every failure
prompts/        what the Mind gets asked
types/          interfaces only
styles/         tokens and base css
```

Every file name starts with a verb. Folders are plain nouns.

## Reading YouTube without burning quota

The daily allowance is 10,000 units. `commentThreads.list` costs 1 unit and
returns 100 comments, so a full read of a channel costs very little.

`allThreadsRelatedToChannelId` pulls comments for a whole channel in one query
rather than looping through every video. If a channel does not allow it, the
app falls back to reading video by video.

`search.list` is never called. It is capped at 100 calls a day and would run
the allowance down fast. Videos are listed from the uploads playlist instead,
which costs 1 unit.

## When something goes wrong

Every failure has one of ten kinds, each with plain wording and whether it can
be retried. The same wording is used by the API and shown in the interface, so
a person never sees a stack trace or a status code.
