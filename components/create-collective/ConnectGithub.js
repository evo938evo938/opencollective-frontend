import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import themeGet from '@styled-system/theme-get';
import styled from 'styled-components';
import { withRouter } from 'next/router';

import { Flex, Box } from '../Grid';
import StyledButton from '../StyledButton';
import { P, H1 } from '../Text';
import GithubRepositories from './GithubRepositories';
import StyledInputField from '../StyledInputField';
import Loading from '../Loading';
import GithubRepositoriesFAQ from '../faqs/GithubRepositoriesFAQ';
import MessageBox from '../MessageBox';
import Link from '../Link';
import ExternalLink from '../ExternalLink';

import { Router } from '../../server/pages';
import { getGithubRepos } from '../../lib/api';

const BackButton = styled(StyledButton)`
  color: ${themeGet('colors.black.600')};
  font-size: ${themeGet('fontSizes.Paragraph')}px;
`;

const messages = defineMessages({
  repoHeader: {
    id: 'openSourceApply.GithubRepositories.title',
    defaultMessage: 'Pick a repository',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
});

class ConnectGithub extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    updateGithubInfo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loadingRepos: false,
      repositories: [],
      error: null,
    };
  }

  async componentDidMount() {
    this.setState({ loadingRepos: true });

    try {
      const repositories = await getGithubRepos(this.props.router.query.token);
      if (repositories.length !== 0) {
        this.setState({ repositories, loadingRepos: false });
      } else {
        this.setState({
          loadingRepos: false,
          error: "We couldn't find any repositories (with >= 100 stars) linked to this account",
        });
      }
    } catch (error) {
      this.setState({
        loadingRepos: false,
        error: error.toString(),
      });
    }
  }

  changeRoute = async params => {
    params = {
      ...params,
      verb: this.props.router.query.verb,
      hostCollectiveSlug: this.props.router.query.hostCollectiveSlug || undefined,
    };
    await Router.pushRoute('create-collective', params);
    window.scrollTo(0, 0);
  };

  render() {
    const { intl } = this.props;
    const { repositories, loadingRepos, error } = this.state;

    return (
      <Flex flexDirection="column" m={[3, 0]} mb={[4]}>
        <Flex flexDirection="column" my={[2, 4]}>
          <Box textAlign="left" minHeight={['32px']} marginLeft={['none', '224px']}>
            <BackButton asLink onClick={() => window && window.history.back()}>
              ←&nbsp;{intl.formatMessage(messages.back)}
            </BackButton>
          </Box>
          <Box mb={[2, 3]}>
            <H1
              fontSize={['H5', 'H3']}
              lineHeight={['H5', 'H3']}
              fontWeight="bold"
              textAlign="center"
              color="black.900"
            >
              {intl.formatMessage(messages.repoHeader)}
            </H1>
          </Box>
          <Box textAlign="center" minHeight={['24px']}>
            <P fontSize="LeadParagraph" color="black.600" mb={2}>
              <FormattedMessage
                id="collective.subtitle.seeRepo"
                defaultMessage="Don't see the repository you're looking for? {helplink}."
                values={{
                  helplink: (
                    <ExternalLink href="https://docs.opencollective.com/help/collectives/osc-verification" openInNewTab>
                      <FormattedMessage id="getHelp" defaultMessage="Get help" />
                    </ExternalLink>
                  ),
                }}
              />
            </P>
            <P fontSize="LeadParagraph" color="black.600" mb={2}>
              <FormattedMessage
                id="collective.subtitle.altVerification"
                defaultMessage="Want to apply using {altverification}? {applylink}."
                values={{
                  applylink: (
                    <Link
                      route="create-collective"
                      params={{
                        hostCollectiveSlug: 'opensource',
                        verb: 'apply',
                        step: 'form',
                        hostTos: true,
                      }}
                    >
                      <FormattedMessage id="clickHere" defaultMessage="Click here" />
                    </Link>
                  ),
                  altverification: (
                    <ExternalLink href="https://www.oscollective.org/#criteria" openInNewTab>
                      <FormattedMessage
                        id="alternativeVerificationCriteria"
                        defaultMessage="alternative verification criteria"
                      />
                    </ExternalLink>
                  ),
                }}
              />
            </P>
          </Box>
        </Flex>
        {error && (
          <Flex alignItems="center" justifyContent="center">
            <MessageBox type="error" withIcon mb={[1, 3]}>
              {error}
            </MessageBox>
          </Flex>
        )}
        {loadingRepos && <Loading />}
        {repositories.length !== 0 && (
          <Flex justifyContent="center" width={1} mb={4} flexDirection={['column', 'row']}>
            <Box width={1 / 5} display={['none', null, 'block']} />
            <Box maxWidth={[400, 500]} minWidth={[300, 400]} alignSelf={['center', 'none']}>
              <StyledInputField htmlFor="collective">
                {fieldProps => (
                  <GithubRepositories
                    {...fieldProps}
                    repositories={repositories}
                    submitGithubInfo={githubInfo => {
                      this.props.updateGithubInfo(githubInfo);
                      this.changeRoute({ category: 'opensource', step: 'form' });
                    }}
                  />
                )}
              </StyledInputField>
            </Box>
            <GithubRepositoriesFAQ
              mt={4}
              ml={[0, 4]}
              display={['block', null, 'block']}
              width={[1, 1 / 5]}
              maxWidth={[250, null, 335]}
              alignSelf={['center', 'none']}
            />
          </Flex>
        )}
      </Flex>
    );
  }
}

export default injectIntl(withRouter(ConnectGithub));
