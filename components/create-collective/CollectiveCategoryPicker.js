import React from 'react';
import styled from 'styled-components';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import themeGet from '@styled-system/theme-get';
import { useRouter } from 'next/router';

import { Flex, Box } from '../Grid';
import { H1 } from '../Text';
import StyledButton from '../StyledButton';
import Container from '../Container';
import Link from '../Link';
import ExternalLink from '../ExternalLink';

const ExamplesLink = styled(ExternalLink)`
  color: ${themeGet('colors.blue.500')};
  font-size: ${themeGet('fontSizes.Caption')}px;

  &:hover {
    color: #dc5f7d;
  }
`;

const Image = styled.img`
  @media screen and (min-width: 52em) {
    height: 256px;
    width: 256px;
  }
  @media screen and (max-width: 40em) {
    height: 192px;
    width: 192px;
  }
  @media screen and (min-width: 40em) and (max-width: 52em) {
    height: 208px;
    width: 208px;
  }
`;

const messages = defineMessages({
  community: {
    id: 'createCollective.category.community',
    defaultMessage: 'For any community',
  },
  opensource: {
    id: 'createCollective.category.newOpenSource',
    defaultMessage: 'For open source projects',
  },
  climate: { id: 'createCollective.category.climate', defaultMessage: 'For climate initiatives' },
  covid: { id: 'createCollective.category.covid', defaultMessage: 'For COVID-19 initiatives' },
});

const CollectiveCategoryPicker = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();

  return (
    <div>
      <Box mb={4} mt={5}>
        <H1 fontSize={['H5', 'H3']} lineHeight={['H5', 'H3']} fontWeight="bold" color="black.900" textAlign="center">
          <FormattedMessage id="createCollective.header.create" defaultMessage="Create a Collective" />
        </H1>
      </Box>
      <Flex flexDirection="column" justifyContent="center" alignItems="center" mb={[5, 6]}>
        <Box alignItems="center">
          <Flex justifyContent="center" alignItems="center" flexDirection={['column', 'row']}>
            <Container alignItems="center" width={[null, 280, 312]} mb={[4, 0]}>
              <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Image
                  src="/static/images/create-collective/openSourceIllustration.png"
                  alt={formatMessage(messages.opensource)}
                />
                <Link
                  route="create-collective"
                  params={{
                    hostCollectiveSlug: router.query.hostCollectiveSlug,
                    verb: router.query.verb,
                    category: 'opensource',
                  }}
                >
                  <StyledButton fontSize="13px" buttonStyle="primary" minHeight="36px" mt={[2, 3]} mb={3} px={3}>
                    {formatMessage(messages.opensource)}
                  </StyledButton>
                </Link>
                <ExamplesLink href="/discover?show=opensource" openInNewTab>
                  <FormattedMessage id="createCollective.examples" defaultMessage="See examples" />
                </ExamplesLink>
              </Flex>
            </Container>
            <Container
              borderLeft={['none', '1px solid #E6E8EB']}
              borderTop={['1px solid #E6E8EB', 'none']}
              alignItems="center"
              width={[null, 280, 312]}
              mb={[4, 0]}
            >
              <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Image
                  src="/static/images/create-collective/climateIllustration.png"
                  alt={formatMessage(messages.covid)}
                />
                <Link
                  route="create-collective"
                  params={{
                    hostCollectiveSlug: router.query.hostCollectiveSlug,
                    verb: router.query.verb,
                    category: 'covid-19',
                  }}
                >
                  <StyledButton fontSize="13px" buttonStyle="primary" minHeight="36px" mt={[2, 3]} mb={3} px={3}>
                    {formatMessage(messages.covid)}
                  </StyledButton>
                </Link>
                <ExamplesLink href="/discover?show=covid-19" openInNewTab>
                  <FormattedMessage id="createCollective.examples" defaultMessage="See examples" />
                </ExamplesLink>
              </Flex>
            </Container>
            <Container
              borderLeft={['none', '1px solid #E6E8EB']}
              borderTop={['1px solid #E6E8EB', 'none']}
              alignItems="center"
              width={[null, 280, 312]}
            >
              <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Image
                  src="/static/images/create-collective/communityIllustration.png"
                  alt={formatMessage(messages.community)}
                />
                <Link
                  route="create-collective"
                  params={{
                    hostCollectiveSlug: router.query.hostCollectiveSlug,
                    verb: router.query.verb,
                    category: 'community',
                  }}
                >
                  <StyledButton fontSize="13px" buttonStyle="primary" minHeight="36px" mt={[2, 3]} mb={3} px={3}>
                    {formatMessage(messages.community)}
                  </StyledButton>
                </Link>
                <ExamplesLink href="/discover?show=community" openInNewTab>
                  <FormattedMessage id="createCollective.examples" defaultMessage="See examples" />
                </ExamplesLink>
              </Flex>
            </Container>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export default CollectiveCategoryPicker;
