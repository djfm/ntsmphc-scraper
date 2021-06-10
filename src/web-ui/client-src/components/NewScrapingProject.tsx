import React, {
  useState,
  useEffect,
  BaseSyntheticEvent,
} from 'react';

import {
  Prompt,
  useHistory,
} from 'react-router-dom';

import {
  useDispatch,
} from 'react-redux';

import {
  Location,
  // TODO this is dirty, may break accidentally
  // if history doesn't get installed...
  // and I just need it for the type!
  // eslint-disable-next-line import/no-extraneous-dependencies
} from 'history';

import { URL } from 'whatwg-url';

import {
  askServer,
} from '../webSocketsIO';

import {
  addNotificationAction,
  addProjectAction,
} from '../redux/actions';

import {
  wrapFeedback,
} from './common/util';

const isValidURL = (url: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

const NewScrapingProject = () => {
  const [startURL, setStartURL] = useState('');
  const [isStartURLValid, setStartURLValid] = useState(undefined);
  const [isStartURLResponding, setStartURLResponding] = useState(undefined);

  const [projectName, setProjectName] = useState('');

  const [isBlocking, setIsBlocking] = useState(false);

  const dispatch = useDispatch();

  const startURLOK = isStartURLValid && isStartURLResponding;
  const projectNameOK = projectName !== '';
  const allGood = startURLOK && projectNameOK;

  const history = useHistory();

  const handleStartURLChange = ((event: BaseSyntheticEvent) => {
    const url = event.target.value;
    setStartURL(url);
    setStartURLValid(isValidURL(url));
    // TODO handle isBlocking for all fields,
    // in a smart generalizable way.
    setIsBlocking(true);
  });

  const handleProjectNameChange = ((event: BaseSyntheticEvent) => {
    // TODO check availability of project name
    // once we start storing them.
    const name = event.target.value;
    setProjectName(name);
  });

  const handleCreateScrapingProjectFormSubmission = ((event: BaseSyntheticEvent) => {
    event.preventDefault();

    if (!allGood) {
      // Probably happening because the user hit the `Return` key
      // and that tried to submit the form, before the submit button
      // appeared. The submit button should only appear when the form
      // is ready.
      // TODO handle this error message gracefully
      // eslint-disable-next-line no-alert
      alert('Some settings are not defined properly, please double-check everything...');
      return;
    }

    askServer('createProject', {
      startURL,
      projectName,
    }).then((project: any) => {
      const notificationMessage = `Successfully created project "${project.projectName}" (#${project.id}).`;
      // do not forget to stop preventing navigation when
      // navigation is what we want :)
      setIsBlocking(false);
      dispatch(addProjectAction(project));
      history.push(`/projects/${project.id}`);
      dispatch(addNotificationAction({
        message: notificationMessage,
        severity: 'success',
      }));
    }, (err) => {
      dispatch(addNotificationAction({
        message: `Something went wrong: "${err.message}"`,
        severity: 'error',
      }));
    });
  });

  useEffect(() => {
    if (isStartURLValid) {
      setStartURLResponding(undefined);
      let updateIsStartURLResponding = true;

      askServer('isRespondingHTTP', { url: startURL }).then((isResponding) => {
        if (updateIsStartURLResponding) {
          setStartURLResponding(isResponding);
        }
      });

      return () => {
        updateIsStartURLResponding = false;
      };
    }
    return null;
  }, [startURL, isStartURLValid]);

  const startURLFeedback = [];

  if (isStartURLValid) {
    startURLFeedback.push('Looks like a URL! ✔');

    if (isStartURLResponding) {
      startURLFeedback.push("It's responding to HTTP requests, good! ✔");
    } else if (isStartURLResponding === false) {
      startURLFeedback.push("It doesn't seem to be reachable over HTTP. ✘");
    } else {
      startURLFeedback.push("I'm trying to see if this URL is reachable over HTTP...");
    }
  } else if (isStartURLValid === false) {
    startURLFeedback.push('This URL seems invalid. ✘');
  }

  const urlFeedback = wrapFeedback(startURLFeedback);

  const makePromptString = (location: Location) => [
    `Are you sure you want to go to "${location.pathname}" ?\n`,
    "You will lose all the data you've input so far.",
  ].join('\n');

  const ui = (
    <main>
      <h1>Create New Scraping Project</h1>

      <Prompt
        when={isBlocking}
        message={makePromptString}
      />

      <p>
        In the form below, you will need to provide a <strong>valid</strong>,&nbsp;
        <strong>reachable URL</strong>, <br />
        including its protocol <strong>(http://)</strong> or <strong>(https://)</strong>.
      </p>

      <p>
        <i>
          The rest of the questions (there aren&apos;t many),<br />
          will appear as you complete each step.
        </i>
      </p>

      <section>
        <form onSubmit={handleCreateScrapingProjectFormSubmission}>
          <label>
            <strong>Start URL</strong>
            <p>
              <i>
                That&apos;s the URL from which the scraper will<br />
                start doing its job.<br />
                It will explore it, then explore all the pages<br />
                reachable from it and belonging to the same site,<br />
                etc. until it has explored all pages.
              </i>
            </p>
            <p>
              <input type="text" value={startURL} onChange={handleStartURLChange} />
            </p>
            {urlFeedback}
          </label>

          {startURLOK && (
            <label>
              <strong>Project Name</strong>
              <p>
                <i>
                  This setting is for you to identify your project,<br />
                  you are free to name it however you wish.
                </i>
              </p>
              <p>
                <input type="text" value={projectName} onChange={handleProjectNameChange} />
              </p>
            </label>
          )}

          {allGood && (
            <div>
              <p>
                <strong>You&apos;re all set!</strong>
              </p>
              <p>
                The scraper will start scraping at &quot;<strong>{startURL}</strong>&quot;,<br />
                and along the way:
              </p>

              <ul>
                <li>identify all pages that produce HTTP error codes</li>
                <li>identify all links to external resources that are not valid</li>
              </ul>

              <p>
                <button type="submit">
                  Create Scraping Project
                </button>
              </p>
            </div>
          )}
        </form>
      </section>
    </main>
  );

  return ui;
};

export default NewScrapingProject;
