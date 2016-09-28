import React from 'react';
import ReactDOM from 'react-dom';
import contentful from 'contentful';
import moment from 'moment';
import marked from 'marked';
import './styles.css';


// Connect to api
const api = contentful.createClient({
  space: 'e8o446ho3rnu',
  accessToken: '33a574e513766798d18a5a01a59e38cd3098255fe96e0b062020e39e67db3bb7',
});

// Create header
const Header = React.createClass({
  render: function () {
    return (
     <header>
       <div className="container">
         <h1 className="logo">
           TECH
           <span className="last">TALKS</span>
         </h1>
         <section className="social">
           <a className="btn" href="https://app.contentful.com/spaces/e8o446ho3rnu/entries" target="blank" title="Open Contentful">Admin</a>
           <a className="btn" href="https://github.com/roll/oki-tech-talks" target="blank" title="Open GitHub">Source</a>
           <a className="btn" href="http://codepen.io/itbruno/full/KwarLp/" target="blank" title="Open CodePen">Theme</a>
         </section>
       </div>
     </header>
    );
  }
});

// Create timeline event
const TimelineEvent = React.createClass({
  render: function () {
    const text = marked(this.props.entry.fields.text || '');
    let state = 'released'
    if (moment(this.props.entry.fields.date) > moment()) {
      state = 'announced';
    }
    let avatar_url = '';
    if ((this.props.entry.fields.speaker.fields.avatar || {}).fields) {
      avatar_url = `http:${this.props.entry.fields.speaker.fields.avatar.fields.file.url}`;
    }
    let entry_image_url = '';
    if (this.props.entry.fields.image) {
      entry_image_url = `http:${this.props.entry.fields.image.fields.file.url}`;
    }
    return (
      <div className={'timeline-item ' +state}>
        <div className="timeline-icon">
          <a href={this.props.entry.fields.speaker.fields.github} title="Open GitHub" target="blank">
            <img src={avatar_url} />
          </a>
        </div>
        <div className="timeline-content">
          <h2>
            {this.props.entry.fields.name}&nbsp;
            <small>[{moment(this.props.entry.fields.date).format('MMMM Do')}]</small>
          </h2>
          <img src={entry_image_url} width="100%" />
          <p dangerouslySetInnerHTML={{__html: text}} />
          <a href={this.props.entry.fields.video} className="btn" title="Open Youtube" target="blank">Screencast</a>
        </div>
      </div>
    );
  }
});

// Create timeline
const Timeline = React.createClass({
  render: function () {
    return (
      <div id="timeline">
        {this.props.items.map((entry) => {
          return <TimelineEvent key={entry.fields.slug} entry={entry} />;
        })}
      </div>
    );
  }
});

// Create application
const App = React.createClass({
  getInitialState: function () {
    return {
      items: [],
    };
  },
  componentDidMount: function () {
    api.getEntries({
      content_type: 'event',
      order: '-fields.date',
    }).then((entries) => {
      this.setState({items: entries.items});
    });
  },
  render: function () {
    return (
      <div>
        <Header />
        <div className="container">
          <h1 className="project-name">TECH TALKS</h1>
          <Timeline items={this.state.items} />
        </div>
      </div>
    );
  }
});

// Render application
ReactDOM.render(<App/>, document.getElementById('app'));
