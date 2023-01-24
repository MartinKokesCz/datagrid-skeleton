<?php declare(strict_types = 1);

namespace App\Presenters;

use Dibi\Connection;
use Nette\Application\UI\Presenter;
use Nette\DI\Attributes\Inject;
use Ublaboo\DataGrid\DataGrid;

abstract class AbstractPresenter extends Presenter
{

	#[Inject]
	public Connection $dibiConnection;

	abstract public function createComponentGrid(): DataGrid;

	public function changeStatus(mixed $id, string $newStatus): void
	{
		$id = (int) $id;

		if (in_array($newStatus, ['active', 'inactive', 'deleted'], true)) {
			$data = ['status' => $newStatus];

			$this->dibiConnection->update('users', $data)
				->where('id = ?', $id)
				->execute();
		}

		if ($this->isAjax()) {
			$grid = $this->getComponent('grid');

			$grid->redrawItem($id);
			$this->flashMessage('Status changed');
			$this->redrawControl('flashes');
		} else {
			$this->redirect('this');
		}
	}

}
