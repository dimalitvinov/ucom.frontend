import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import React, { Fragment, PureComponent } from 'react';
import CreatePostHeader from '../../components/CreatePostHeader';
import Loading from '../../components/Loading';
import CreatePostFooter from '../../components/CreatePostFooter';
import TextInput from '../../components/TextInput';
import PrefixInput from '../../components/PrefixInput';
import Switcher from '../../components/Switcher';
import DropZone from '../../components/DropZone';

class StoryPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newPostId: null,
      loading: false,
      saved: false,
    };
  }

  save() {
    this.setState({
      loading: false,
      saved: true,
      newPostId: 1,
    });
  }

  render() {
    return this.state.saved ? (
      <Redirect to={`/posts/offer/${this.state.newPostId}`} />
    ) : (
      <Fragment>
        <Loading loading={this.state.loading} />

        <CreatePostHeader
          location={this.props.location}
          onClickPost={() => { this.save(); }}
          withoutTabs
        />
        <div className="create-post__content">
          <div className="settings">
            <div className="settings__form">
              <div className="settings__block">
                <div className="settings__label">Name Media Post</div>
                <div className="settings__input">
                  <PrefixInput
                    prefix="u.community/"
                    subtext="Media Post id - id23784528"
                  />
                </div>
              </div>
              <div className="settings__block">
                <div className="settings__label">Offer Title</div>
                <div className="settings__input">
                  <TextInput placeholder="Type something..." />
                </div>
              </div>
              <div className="settings__block">
                <div className="settings__label">Action Button</div>
                <div className="settings__input">
                  <TextInput placeholder="Name of Acton Button" />
                </div>
              </div>
              <div className="settings__block">
                <div className="settings__label" />
                <div className="settings__input">
                  <TextInput placeholder="Link" />
                </div>
              </div>
              <div className="settings__block">
                <div className="settings__label">Time Sale</div>
                <div className="settings__input">
                  <TextInput placeholder="Days" inputWidth={120} />
                </div>
              </div>
              <div className="settings__block">
                <div className="settings__label" />
                <div className="settings__input">
                  Unlimited
                  <Switcher />
                </div>
              </div>
              <div className="settings__block">
                <div className="settings__label">Add Team</div>
                <div className="settings__input">
                  <TextInput placeholder="Find People" />
                </div>
              </div>
              <div className="settings__block">
                <div className="settings__label">Offer&apos;s cover</div>
                <div className="settings__input">
                  <DropZone text="add or drag img" />
                  You can upload an image in JPG or PNG format.
                  Size is not more than 10mb.
                </div>
              </div>
            </div>
          </div>
        </div>

        <CreatePostFooter onClickPost={() => this.save()} />
      </Fragment>
    );
  }
}

export default connect(state => ({
  user: state.user,
}), null)(StoryPage);
