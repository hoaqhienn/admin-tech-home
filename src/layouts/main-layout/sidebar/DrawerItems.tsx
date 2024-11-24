import { fontFamily } from 'theme/typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItem from './list-items/ListItem';
import CollapseListItem from './list-items/CollapseListItem';
import Image from 'components/base/Image';
import LogoImg from 'assets/images/logo.png';
import sitemap from 'routes/sitemap';
import { useState } from 'react';
import LogoutComponent from 'components/auth/Logout';

const DrawerItems = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <>
      <Stack
        pt={5}
        pb={3.5}
        px={4.5}
        position="sticky"
        top={0}
        bgcolor="info.light"
        alignItems="center"
        justifyContent="flex-start"
        borderBottom={1}
        borderColor="info.main"
        zIndex={1000}
      >
        <ButtonBase component={Link} href="/" disableRipple>
          <Image src={LogoImg} alt="logo" height={52} width={52} sx={{ mr: 1.75 }} />
          <Box>
            <Typography
              mt={0.25}
              variant="h4"
              color="primary.main"
              textTransform="uppercase"
              letterSpacing={1}
              fontFamily={fontFamily.poppins}
            >
              TECH HOME
            </Typography>
            <Typography
              mt={-0.35}
              variant="body2"
              color="primary.main"
              textTransform="uppercase"
              fontWeight={500}
              fontFamily={fontFamily.poppins}
            >
              Dashboard
            </Typography>
          </Box>
        </ButtonBase>
      </Stack>

      <List component="nav" sx={{ mt: 2.5, px: 4.5 }}>
        {sitemap.map((route) =>
          route.items ? (
            <CollapseListItem
              key={route.id}
              {...route}
              isOpen={openMenuId === route.id}
              onToggle={(isOpen) => setOpenMenuId(isOpen ? route.id : null)}
            />
          ) : (
            <ListItem key={route.id} {...route} />
          ),
        )}
      </List>

      <Box
        mt="auto"
        p={1}
        position="sticky"
        top={0}
        bgcolor="info.light"
        alignItems="center"
        justifyContent="flex-start"
        borderBottom={1}
        borderColor="info.main"
        zIndex={1000}
      >
        <LogoutComponent />
      </Box>
    </>
  );
};

export default DrawerItems;
